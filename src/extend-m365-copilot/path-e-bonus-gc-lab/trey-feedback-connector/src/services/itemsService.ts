import fs from 'fs';
import matter, { GrayMatterFile } from 'gray-matter';
import path from 'path';
import removeMd from 'remove-markdown';
import { Config } from '../models/Config';
import { Item } from '../models/Item';
import { getItemFromDocument } from '../custom/getItemFromDocument';

/**
 * Extracts the content from the files in the content directory.
 * @param config - The configuration object.
 * @returns An array of GrayMatterFile objects.
 */
function extractDocuments(config: Config): GrayMatterFile<string>[] {
  let content = [];
  let contentFiles = fs.readdirSync('./content');

  contentFiles.forEach(f => {
    if (!f.endsWith('.md')) {
      return;
    }

    const fileContents = fs.readFileSync(path.resolve('./content', f), 'utf-8');
    const doc = matter(fileContents);
    doc.content = removeMd(doc.content.replace(/<[^>]+>/g, ' '));
    doc.data.url = new URL(doc.data.id, config.connector.baseUrl).href;
    content.push(doc);
  });

  return content;
}

/**
 * Gets all items from the repository.
 * @param config - The configuration object.
 * @returns An array of items.
 */
export function getAllItems(config: Config): Item[] {
  const content = extractDocuments(config);

  return content.map(doc => {
    return getItemFromDocument(doc, config);
  });
}
