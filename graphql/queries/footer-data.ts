import gql from 'graphql-tag';

export const FOOTER = gql`
  query {
    footerCollection {
      items {
        brandName
        linksCollection {
          items {
            ... on Link {
              linkTitle
              linkUrl
            }
          }
        }
      }
    }
  }
`;
