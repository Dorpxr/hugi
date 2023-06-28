import path from 'path'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { Author } from './interfaces/author.interface'

export const getAuthorDetails = async (): Promise<Author> => {
  const filePath = path.join(process.cwd(), 'data', 'authors', 'default.md')
  const authorFileSource = (await readFile(filePath, 'utf-8')).toString()
  const { data: authorDetails } = matter(authorFileSource) as unknown as { data: Author }
  return authorDetails
}
