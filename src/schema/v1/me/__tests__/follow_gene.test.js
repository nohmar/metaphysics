/* eslint-disable promise/always-return */
import { runAuthenticatedQuery } from "schema/v1/test/utils"

describe("FollowGene", () => {
  it("follows a gene", () => {
    const mutation = `
      mutation {
        followGene(input: { gene_id: "pop-art" }) {
          gene {
            id
            name
          }
        }
      }
    `

    const context = {
      followGeneLoader: () =>
        Promise.resolve({
          gene: {
            family: {},
            id: "pop-art",
            name: "Pop Art",
            image_url: "",
            image_urls: {},
            display_name: null,
          },
        }),
      geneLoader: () =>
        Promise.resolve({
          family: {
            id: "styles-and-movements",
          },
          id: "pop-art",
          name: "Pop Art",
          browseable: true,
        }),
    }

    const expectedGeneData = {
      gene: {
        id: "pop-art",
        name: "Pop Art",
      },
    }

    expect.assertions(1)
    return runAuthenticatedQuery(mutation, context).then(({ followGene }) => {
      expect(followGene).toEqual(expectedGeneData)
    })
  })
})
