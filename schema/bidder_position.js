import { get } from 'lodash';
import gravity from '../lib/loaders/gravity';
import date from './fields/date';
import money, { amount } from './fields/money';
import SaleArtwork from './sale_artwork';
import {
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

const BidderPositionType = new GraphQLObjectType({
  name: 'BidderPosition',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    created_at: date,
    updated_at: date,
    processed_at: date,
    is_active: {
      type: GraphQLBoolean,
      resolve: ({ active }) => active,
    },
    is_retracted: {
      type: GraphQLBoolean,
      resolve: ({ retracted }) => retracted,
    },
    is_with_bid_max: {
      type: GraphQLBoolean,
      resolve: ({ bid_max }) => bid_max,
    },
    is_winning: {
      type: GraphQLBoolean,
      resolve: (position) =>
        gravity(`sale_artwork/${position.sale_artwork_id}`)
          .then(saleArtwork =>
            get(saleArtwork, 'highest_bid.id') === get(position, 'highest_bid.id')
          ),
    },
    max_bid: money({
      name: 'BidderPositionMaxBid',
      resolve: ({ max_bid_amount_cents }) => max_bid_amount_cents,
    }),
    suggested_next_bid: money({
      name: 'BidderPositionSuggestedNextBid',
      resolve: ({ suggested_next_bid_cents }) => suggested_next_bid_cents,
    }),
    sale_artwork: {
      type: SaleArtwork.type,
      resolve: position => gravity(`sale_artwork/${position.sale_artwork_id}`),
    },
    highest_bid: {
      type: new GraphQLObjectType({
        name: 'HighestBid',
        fields: {
          id: {
            type: GraphQLString,
          },
          created_at: date,
          number: {
            type: GraphQLInt,
          },
          is_cancelled: {
            type: GraphQLBoolean,
            resolve: ({ cancelled }) => cancelled,
          },
          amount: amount(({ amount_cents }) => amount_cents),
          cents: {
            type: GraphQLInt,
            resolve: ({ amount_cents }) => amount_cents,
          },
          amount_cents: {
            type: GraphQLInt,
            deprecationReason: 'Favor `cents`',
          },
          display_amount_dollars: {
            type: GraphQLString,
            deprecationReason: 'Favor `amount`',
          },
        },
      }),
    },
    display_max_bid_amount_dollars: {
      type: GraphQLString,
      deprecationReason: 'Favor `max_bid`',
    },
    display_suggested_next_bid_dollars: {
      type: GraphQLString,
      deprecationReason: 'Favor `suggested_next_bid`',
    },
    max_bid_amount_cents: {
      type: GraphQLInt,
      deprecationReason: 'Favor `max_bid`',
    },
    suggested_next_bid_cents: {
      type: GraphQLInt,
      deprecationReason: 'Favor `suggested_next_bid`',
    },
  }),
});

const BidderPosition = {
  type: BidderPositionType,
  description: 'An BidderPosition',
};

export default BidderPosition;
