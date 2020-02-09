import { mutationWithClientMutationId } from "graphql-relay"
import { ResolverContext } from "types/graphql"
import { GraphQLInputObjectType, GraphQLString } from "graphql"

const InputType = new GraphQLInputObjectType({
  name: "StartIdentityVerificationInput",
  fields: {
    identityVerificationId: {
      type: GraphQLString,
      description: "Primary ID of the identity verification to be started",
    },
  },
})

export const startIdentityVerificationMutation = mutationWithClientMutationId<
  any,
  any,
  ResolverContext
>({
  name: "startIdentityVerificationMutation",
  description: "Start an existing identity verification flow",
  inputFields: InputType.getFields(),
  outputFields: {
    identityVerificationId: {
      type: GraphQLString,
    },
    identityVerificationWizardUrl: {
      type: GraphQLString,
      resolve: _ => "https://staging.artsy.net/auctions",
    },
  },
  mutateAndGetPayload: ({ identityVerificationId }) => {
    return {
      identityVerificationId: identityVerificationId,
    }
  },
})
