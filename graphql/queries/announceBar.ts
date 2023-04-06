import gql from 'graphql-tag';

export const ANNOUNCEMENT_BAR = gql`
  query {
    # add your query
    announcementBarCollection {
      items {
        ... on AnnouncementBar {
          defaultMessage
          freeShippingThreshold
          successMessage
        }
      }
    }
  }
`;
