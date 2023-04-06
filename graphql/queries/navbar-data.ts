import gql from 'graphql-tag';

export const NAVBAR = gql`
  query {
    navbarCollection {
      items {
        ... on Navbar {
          logo {
            url
          }
          loginUrl
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
  }
`;
