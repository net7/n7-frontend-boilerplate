// Mock per image-viewer mirador

export default {
  title: "La crise de l'esprit",
  sections: {
    header: {
      title: "La crise de l'esprit"
    },
    'image-viewer': {
      images: [
        {
          type: 'image',
          url: 'http://aitia.muruca.cloud/wp-content/uploads/2024/03/N-I-11.jpg',
          description: '',
          caption: 'Aenean viverra rhoncus'
        },
        {
          type: 'image',
          url: 'http://aitia.muruca.cloud/wp-content/uploads/2024/03/N-I-12.jpg',
          description: '',
          caption: 'In turpis. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.'
        },
      ],
      thumbs: [
        'http://aitia.muruca.cloud/wp-content/uploads/2024/03/N-I-11-150x150.jpg',
        'http://aitia.muruca.cloud/wp-content/uploads/2024/03/N-I-12-150x150.jpg'
      ],

      // libOptions: {
      //   window: {
      //     sideBarOpenByDefault: true,
      //   },
      //   id: 'mirador-container',
      //   windows: [
      //     {
      //       imageToolsEnabled: true,
      //       manifestId:
      //         'https://dam.iccu.sbn.it/mol_447/containers/dPQWLWe/manifest',
      //     },
      //   ],
      // },
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

// export const MIRADOR_MOCK = {
//   libOptions: {
//     window: {
//       // Open sidebar by default
//       sideBarOpenByDefault: true,
//     },
//     // ID of the Mirador container
//     id: 'mirador-container',
//     windows: [
//       {
//         // Enable image tools
//         imageToolsEnabled: true,
//         // Manifest ID of the IIIF manifest to loads
//         manifestId:
//           'https://dam.iccu.sbn.it/mol_447/containers/dPQWLWe/manifest',
//       },
//     ],
//   },
// };
