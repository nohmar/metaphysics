import { GraphQLString, GraphQLNonNull } from "graphql"
import { mutationWithClientMutationId } from "graphql-relay"
import { AssetType } from "./asset"

export default mutationWithClientMutationId({
  name: "AddAssetToConsignmentSubmission",
  description: "Attach an impulse asset to a consignment submission",
  inputFields: {
    asset_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The type of the asset, currently only 'image' is supported",
    },
    gemini_token: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The token provided by Gemini for your asset",
    },
    submission_id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the submission you want to attach an asset to",
    },
  },
  outputFields: {
    asset: {
      type: AssetType,
      resolve: response => response,
    },
  },
  mutateAndGetPayload: (assets, request, { rootValue: { assetCreateLoader } }) => {
    if (!assetCreateLoader) return null
    return assetCreateLoader(assets)
  },
})
