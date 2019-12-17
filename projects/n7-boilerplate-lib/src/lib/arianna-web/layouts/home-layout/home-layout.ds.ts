import { LayoutDataSource } from '@n7-frontend/core';
import { Subject, forkJoin, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export class AwHomeLayoutDS extends LayoutDataSource {
    private communication: any;
    private mainState: any;
    private tippy: any;
    private configuration: any;
    private facetInputs: any = {};
    private autocompletePopover: any;
    private autocompletePopoverOpen: boolean = false;
    private autocompleteChanged$: Subject<string> = new Subject();
    public numOfItemsStr: string = null;
    public currentHoverEntity: any = null;
    public hasScrollBackground: boolean = false;
    public resultsLimit = -1;
    public selectedEntitiesIds = [];
    public outerLinks: any;
    public outerLinksTitle: string;
    public homeAutocompleteQuery: string;
    private destroyed$: Subject<any> = new Subject();
    // BUBBLE CHART DATA ↓
    public bubblesEnabled: boolean = false; // true if this Arianna Web project has the bubble chart module
    public selectedBubbles: any[] = []      // array of IDs
    public lastBubbleResponse: any          // store last bubble response to refresh the graph with the same data
    public firstBubbleResponse: any         // store the first array of bubbles, to find them in case of zero results (entities data returned as empty array from backend)
    // BUBBLE CHART DATA ↑

    onInit({ communication, mainState, configuration, tippy }) {
        this.communication = communication;
        this.configuration = configuration;
        // this.facetData = [];
        this.mainState = mainState;
        this.tippy = tippy;
        this.resultsLimit = this.configuration.get('home-layout')['results-limit']
        this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled')['bubblechart'] : false;
        this.one('aw-hero').update(this.configuration.get('home-layout')['top-hero']);
        this.one('aw-home-hero-patrimonio').update(this.configuration.get('home-layout')['bottom-hero']);
        // update streams
        this.mainState.update('headTitle', 'Arianna Web > Home');
        this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
        this.mainState.updateCustom('currentNav', 'aw/home');
        // listen autocomplete changes
        this._listenAutoCompleteChanges();
        this.outerLinks = this.configuration.get('home-layout')['outer-links']['test'];
        this.outerLinksTitle = this.configuration.get('home-layout')['outer-links']['title'];
        this.one('aw-bubble-chart').updateOptions({ config: this.configuration })
    }

    onDestroy(){
        this.destroyed$.next()
    }

    public makeRequest$(query, params) {
        // make request from EH
        return this.communication.request$(query, {
            onError: (error) => console.error(error),
            params
        });
    }

    public updateComponent = (id, data, options?) => {
        // update components from EH
        if (options) {
            this.one(id).updateOptions(options)
        }
        this.one(id).update(data)
    }

    initialFilterRequest() {
        return this.communication.request$('globalFilter', {
            onError: (error) => console.error(error),
            params: {
                entitiesListSize: this.configuration.get('home-layout')['max-bubble-num']
            },
        })
    }

    parseInitialRequest(response) {
        this.firstBubbleResponse = response.entitiesData
        const facetData = []
        response.typeOfEntityData.forEach((toe) => {
            const TOEconfigData = this.configuration.get("config-keys")[toe.type.replace(" ", "-")];
            facetData.push({
                ...toe,
                enabled: true,
                locked: false,
                configKey: toe.type.replace(" ", "-"),
                ...TOEconfigData
            });
        });
        this.one('aw-home-facets-wrapper').update(facetData);
    }

    renderPreviewsFromApolloQuery(response: any) {
        if (!response || !response.itemsPagination) {
            return
        };
        let numOfItems = response.itemsPagination.totalCount;
        if (numOfItems > 0) {
            let numOfThousand = 0;
            while (numOfItems > 999) {
                numOfItems -= 1000;
                numOfThousand += 1;
            }
            let numOfItemsTmpStr = numOfItems + '';
            if (numOfItems < 10) numOfItemsTmpStr = '00' + numOfItems;
            else if (numOfItems < 100) numOfItemsTmpStr = '0' + numOfItems;
            if (numOfThousand > 0)
                this.numOfItemsStr = numOfThousand + '.' + numOfItemsTmpStr;
            else
                this.numOfItemsStr = numOfItems + '';
        } else {
            this.numOfItemsStr = '0';
        }
        this.one('aw-linked-objects').updateOptions({
            context: 'home',
            config: this.configuration,
        })
        this.one('aw-linked-objects').update(response.itemsPagination);
    }

    public updateTags(onlyBubbles?: boolean) {
        if (!onlyBubbles) {
            this.renderItemTags();
        }
    }

    handleFacetSearchChange(change) {
        var payload: string = change.inputPayload;
        var value: string = change.value;
        // store the entered text in facetInputs
        this.facetInputs[payload] = value;
    }

    handleFacetSearchEnter(enter) {
        var payload: string = enter.inputPayload;
        // get the text entered in this input
        var value: string = this.facetInputs[payload];
    }

    renderItemTags() {
        /*
            Try to build an item tag for each selected query looking at the data from the
            first response. If the needed bubble data cannot be found, ask the backend
            for that bubble's data.
        */
        let queryList = [] // list of pending queries
        let tagsData = []  // list of tags data built from query
        this.selectedBubbles.forEach(b => { // try to get the data of each selected bubble
            let theBubble = this.firstBubbleResponse.find(el => el.entity.id == b)
            if (theBubble) { // if a bubble was found
                tagsData.push({
                    label: theBubble.entity.label,
                    icon: 'n7-icon-close',
                    payload: b,
                    classes: `tag-${theBubble.entity.typeOfEntity.replace(/ /g, '-')}`
                })
            } else { // if the bubble was not found, make a query
                let params = { entityId: b, entitiesListSize: 1 }
                queryList.push(this.makeRequest$('getMissingBubble', params))
            }
        });
        if (queryList.length > 0) { // if there are pending bubble queries
            forkJoin(queryList).subscribe(forkres => {
                forkres.forEach(r => {
                    tagsData.push({
                        label: r.label,
                        icon: 'n7-icon-close',
                        payload: r.id,
                        classes: `tag-${r.typeOfEntity.replace(/ /g, '-')}`
                    })
                });
                this.one('aw-home-item-tags-wrapper').update(tagsData);
            })
        } else {
            this.one('aw-home-item-tags-wrapper').update(tagsData);
        }
    }

    onHeroChange(value) {
        this.autocompleteChanged$.next(value);
    }

    private _scrollBackgroundControl() {
        const el = document.getElementById('bubble-results-list'),
            source$ = fromEvent(document.getElementById('bubble-results-list'), 'scroll');

        // height control
        setTimeout(() => {
            this._setHasScrollBackground(el);
        }, 500);

        // scroll listen
        source$.pipe(
            debounceTime(50)
        ).subscribe(({ target }: { target: any }) => {
            this._setHasScrollBackground(target);
        });
    }

    private _setHasScrollBackground({ scrollTop, scrollHeight, clientHeight }) {
        this.hasScrollBackground = scrollHeight > (scrollTop + clientHeight);
    }

    private _listenAutoCompleteChanges() {
        this.one('aw-home-autocomplete').updateOptions({
            keys: this.configuration.get('config-keys'),
            config: this.configuration,
            labels: this.configuration.get('labels')
        });
        this.autocompleteChanged$.pipe(
            debounceTime(500),
            takeUntil(this.destroyed$)
        ).subscribe(value => {
            if (value) {
                this.communication.request$('autoComplete', {
                    onError: (error) => console.error(error),
                    params: {
                        input: value,
                        itemsPagination: { offset: 0, limit: this.configuration.get('home-layout')['results-limit'] }
                    }
                }).subscribe((response) => {
                    this.one('aw-home-autocomplete').update(response);
                    if (!this.autocompletePopoverOpen) this._toggleAutocompletePopover();
                });
            } else {
                this._toggleAutocompletePopover();
            }
        });
    }

    private _toggleAutocompletePopover() {
        if (!this.autocompletePopover) {
            const template = document.getElementById('aw-home-advanced-autocomplete-popover');
            template.style.display = 'block';
            this.autocompletePopover = this.tippy('.aw-home__top-hero .n7-hero__input', {
                content: template,
                trigger: 'manual',
                interactive: true,
                arrow: false,
                flip: false,
                appendTo: 'parent',
                theme: 'light-border',
                placement: 'bottom-start',
                maxWidth: '100%',
                onHidden: () => this.autocompletePopoverOpen = false,
            })[0];
        }
        if (this.autocompletePopoverOpen) {
            this.autocompletePopover.hide();
        } else {
            this.autocompletePopover.show();
        }
        this.autocompletePopoverOpen = !this.autocompletePopoverOpen;
    }
}
