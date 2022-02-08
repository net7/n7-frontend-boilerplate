import { ConfigCommonFooter } from '@net7/boilerplate-common';

const config: ConfigCommonFooter = {
  columns: [
    {
      classes: 'col-class',
      title: 'Arianna4View, archivio digitale online',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur hendrerit elit nunc, at porta ex accumsan id. Fusce quis lobortis sem, non ornare tellus.',
      images: [
        {
          url: 'https://via.placeholder.com/80',
          alttext: 'Logo 1',
          anchor: {
            href: 'https://www.google.it'
          }
        },
        {
          url: 'https://via.placeholder.com/80',
          alttext: 'Logo 2',
          anchor: {
            href: 'https://www.google.it'
          }
        }
      ]
    },
    {
      title: 'Privacy e info',
      links: [
        {
          text: 'Info su Arianna4View',
          classes: 'link-class',
          anchor: {
            href: 'https://www.google.it'
          }
        },
        {
          text: 'Privacy policy',
          classes: 'link-class',
          anchor: {
            href: 'https://www.google.it'
          }
        },
        {
          text: 'Cooklie policy',
          anchor: {
            href: 'https://www.google.it'
          }
        },
        {
          text: 'Termini e condizioni',
          anchor: {
            href: 'https://www.google.it'
          }
        }
      ]
    },
    {
      text: "Arianna4View is powered by Hyperborea.<br><a href='#' target='_blank'>www.hyperborea.com</a>"
    }
  ]
};

export default config;
