import gql from 'graphql-tag';

export const GET_TEXT_IMAGE_SECTION = gql`
  query GetTextImageSection($id: String!) {
    textImageSection(id: $id) {
      ... on TextImageSection {
        sectionTitle
        sectionBody {
          json
        }
        sectionImageOrGif {
          url
        }
      }
    }
  }
`;
