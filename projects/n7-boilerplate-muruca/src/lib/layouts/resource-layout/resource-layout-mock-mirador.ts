// Mock per image-viewer mirador

export default {
  title: "La crise de l'esprit",
  sections: {
    header: {
      title: "La crise de l'esprit"
    },
    'image-viewer': {
      libOptions: {
        window: {
          sideBarOpenByDefault: true,
        },
        id: 'mirador-container',
        windows: [
          {
            imageToolsEnabled: true,
            manifestId:
              'https://dam.iccu.sbn.it/mol_447/containers/dPQWLWe/manifest',
          },
        ],
      },
    },
    metadata: {
      group: [
        {
          title: 'Metadata',
          items: [
            {
              label: 'description',
              value: 'Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante odio sit amet eros.'
            },
            {
              label: 'creator',
              value: 'Paul Valéry'
            },
          ]
        }
      ]
    },
  }
};
