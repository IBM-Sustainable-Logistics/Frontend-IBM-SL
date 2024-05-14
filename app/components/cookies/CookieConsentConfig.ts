import type { CookieConsentConfig } from 'vanilla-cookieconsent';


// https://cookieconsent.orestbida.com/

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      position: 'left',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  onFirstConsent: function () {
    console.log('onFirstAction fired');
  },

  onConsent: function ({ cookie }) {
    console.log('onConsent fired ...');
  },

  onChange: function ({ changedCategories, cookie }) {
    console.log('onChange fired ...');
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)/,
          },
        ],
      },
    },
  },

  language: {
    default: 'en',

    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            'Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept explicitly. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Manage preferences</a>',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          //closeIconLabel: 'Close',
          footer: `
            <a href="#link">Privacy Policy</a>
            <a href="#link">Impressum</a>
          `,
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie Usage',
              description:
                'We use cookies to ensure the basic functionalities of our website and to enhance your online experience. You can choose to opt-in or opt-out of each category at any time. For more details about cookies and how we handle your sensitive data, please read our full <a href="#" class="cc__link">privacy policy</a>.',
            },
            {
              title: 'Strictly necessary cookies',
              description: 'These cookies are essential for the website to function properly. They ensure basic functionalities and security features of the website, anonymously.',
              linkedCategory: 'necessary',
            },
            {
              title: 'More information',
              description:
                'For any queries regarding our policy on cookies and your choices, please <a class="cc__link" href="#hananinas.com">contact us</a>.',
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;
