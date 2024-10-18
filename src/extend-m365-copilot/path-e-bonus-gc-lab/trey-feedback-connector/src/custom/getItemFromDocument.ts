import { GrayMatterFile } from 'gray-matter';
import { Config } from '../models/Config';
import { Item } from '../models/Item';

export function getItemFromDocument(doc: GrayMatterFile<string>, config: Config): Item {
  return {
    id: doc.data.id,
    lastModified: new Date(doc.data.lastModified),
    title: doc.data.title,
    abstract: doc.data.abstract,
    consultant: doc.data.consultant,
    content: doc.content,
    url: doc.data.url
  };
}
