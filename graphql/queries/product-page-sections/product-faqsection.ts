import gql from 'graphql-tag';

export const PRODUCT_FAQ_SECTION = gql`
  query GetFAQSection($id: String!) {
    faqSection(id: $id) {
      ... on FaqSection {
        sectionTitle
        sectionSubtitle
        informationalDropdownsCollection {
          items {
            ... on InformationalDropdown {
              dropdownTitle
              dropdownBody {
                ... on InformationalDropdownDropdownBody {
                  json
                }
              }
            }
          }
        }
      }
    }
  }
`;
