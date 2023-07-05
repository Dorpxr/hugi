# Hugi - Automated CMS App

![hugi social banner](/public/static/images/banner.png)

This application is a fork of a fork of [timlrx's tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) and so shares similar features but has many interesting enhancements. The original LICENSE is included here as well.

See [Hugi Upload Service Repo](https://github.com/Dorpxr/hugi-upload-service) to see the scheduled job that generates content for the site.

## Features

- OpenAI chat generated **title**, **summary** and **page content**.
- OpenAI DALL-E generated images.
- [Notion](https://www.notion.so/) database driven cms.
- Using [notion-to-markdown](package) to render notion api compatible markdown blocks to mdx renderer.
- Popular posts carousel ranked via google analytics api page views.
