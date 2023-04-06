import gql from 'graphql-tag';

export const PRODUCT_EMAIL_SIGNUP = gql`
  query GetEmailSignup($id: String!) {
    emailSignupSection(id: $id) {
      sectionTitle
      sectionSubtitle
      sectionTextBody
      signupFormPlaceholder
      signupCallToAction
    }
  }
`;

export const EMAIL_SIGNUP = gql`
  query {
    emailSignupSectionCollection {
      items {
        ... on EmailSignupSection {
          sectionTitle
          sectionSubtitle
          sectionTextBody
          signupFormPlaceholder
          signupCallToAction
        }
      }
    }
  }
`;
