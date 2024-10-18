import { Item } from '../models/Item';
import { ExternalConnectors } from '@microsoft/microsoft-graph-types';

export function getExternalItemFromItem(item: Item): ExternalConnectors.ExternalItem {
  return {
    id: item.id,
    properties: {
      lastModified: item.lastModified.toISOString().slice(0, -5) + 'Z',
      title: item.title,
      abstract: item.abstract,
      consultant: item.consultant,
      url: item.url
    },
    content: {
      value: item.content,
      type: 'text'
    },
    acl: [
      {
        accessType: 'grant',
        type: 'everyone',
        value: 'everyone'
      }
    ]
  } as ExternalConnectors.ExternalItem;
}
