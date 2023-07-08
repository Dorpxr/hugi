export interface StoriesDatabase {
  object: StoriesDatabaseObject
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
  object: CreatedByObject
  id: string
}

export enum CreatedByObject {
  User = 'user',
}

export enum StoriesDatabaseObject {
  Page = 'page',
}

export interface Parent {
  type: ParentType
  database_id: string
}

export enum ParentType {
  DatabaseID = 'database_id',
}

export interface Properties {
  FeatureImageUrl: FeatureImageURL
  Status: Status
  Summary: Summary
  Featured: Featured
  Tags: Tags
  Story: Story
}

export interface FeatureImageURL {
  id: FeatureImageURLID
  type: FeatureImageURLType
  url: string
}

export enum FeatureImageURLID {
  The3DtbS = '%3DtbS',
}

export enum FeatureImageURLType {
  URL = 'url',
}

export interface Featured {
  id: FeaturedID
  type: FeaturedType
  checkbox: boolean
}

export enum FeaturedID {
  W5B5CO = 'w%5B%5CO',
}

export enum FeaturedType {
  Checkbox = 'checkbox',
}

export interface Status {
  id: StatusID
  type: StatusType
  status: StatusElement
}

export enum StatusID {
  Oa3FS = 'Oa%3FS',
}

export interface StatusElement {
  id: string
  name: string
  color: string
}

export enum StatusType {
  Status = 'status',
}

export interface Story {
  id: TypeEnum
  type: TypeEnum
  title: Title[]
}

export enum TypeEnum {
  Title = 'title',
}

export interface Title {
  type: TitleType
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
  color: Color
}

export enum Color {
  Default = 'default',
}

export interface Text {
  content: string
  link: null
}

export enum TitleType {
  Text = 'text',
}

export interface Summary {
  id: SummaryID
  type: SummaryType
  rich_text: Title[]
}

export enum SummaryID {
  J60N = 'j%60n~',
}

export enum SummaryType {
  RichText = 'rich_text',
}

export interface Tags {
  id: TagsID
  type: TagsType
  multi_select: StatusElement[]
}

export enum TagsID {
  The7DnhL = '%7DnhL',
}

export enum TagsType {
  MultiSelect = 'multi_select',
}
