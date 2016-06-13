import { slugs } from './maps/artist_title_slugs';
import descriptions from './maps/artist_meta_descriptions';
import { stripTags, truncate, markdownToText } from '../../lib/helpers';
import { compact } from 'lodash';
import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';


export const countDisplay = (artist) => {
  const count = artist.published_artworks_count;

  if (count < 10) { return ''; }
  if (count < 100) { return `${Math.floor(count / 10) * 10}+ `; }
  if (count < 10000) { return `${Math.floor(count / 100) * 100}+ `; }
  return `${Math.floor(count / 10000) * 10000}+ `;
};

export const metaName = (artist) => {
  if (artist.name) return stripTags(artist.name);
  return 'Unnamed Artist';
};

const ArtistMetaType = new GraphQLObjectType({
  name: 'ArtistMeta',
  fields: {
    title: {
      type: GraphQLString,
      resolve: (artist) => {
        if (slugs.indexOf(artist.id) !== -1) {
          return `${artist.name} Art - ${countDisplay(artist)}Works, Bio, News | Artsy`;
        }
        const count = artist.published_artworks_count;
        return `${metaName(artist)} - ${count} Artworks, Bio & Shows on Artsy`;
      },
    },
    description: {
      type: GraphQLString,
      resolve: (artist) => {
        if (descriptions[artist.id]) {
          return descriptions[artist.id];
        }
        const blurb = artist.blurb.length ? markdownToText(artist.blurb) : undefined;
        const description = compact([
          `Find the latest shows, biography, and artworks for sale by ${metaName(artist)}`,
          blurb,
        ]).join('. ');
        return truncate(description, 200);
      },
    },
  },
});

export default {
  type: ArtistMetaType,
  resolve: x => x,
};