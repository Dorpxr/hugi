export interface RecipesDatabase {
  object: string
  id: string
  created_time: string
  last_edited_time: string
  created_by: TedBy
  last_edited_by: TedBy
  cover: null
  icon: null
  parent: Parent
  archived: boolean
  properties: Properties
  url: string
  public_url: null
}

export interface TedBy {
  object: string
  id: string
}

export interface Parent {
  type: string
  database_id: string
}

export interface Properties {
  FeatureImage: FeatureImage
  Status: Status
  Summary: Summary
  Featured: Featured
  Tags: Tags
  Story: Story
}

export interface FeatureImage {
  id: string
  type: string
  files: FileElement[]
}

export interface FileElement {
  name: string
  type: string
  file: FileFile
}

export interface FileFile {
  url: string
  expiry_time: string
}

export interface Featured {
  id: string
  type: string
  checkbox: boolean
}

export interface Status {
  id: string
  type: string
  status: StatusElement
}

export interface StatusElement {
  id: string
  name: string
  color: string
}

export interface Story {
  id: string
  type: string
  title: Title[]
}

export interface Title {
  type: string
  text: Text
  annotations: Annotations
  plain_text: string
  href: null
}

export interface Annotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export interface Text {
  content: string
  link: null
}

export interface Summary {
  id: string
  type: string
  rich_text: Title[]
}

export interface Tags {
  id: string
  type: string
  multi_select: StatusElement[]
}
