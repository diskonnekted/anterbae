import { defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const categoryType = defineType({
  name: 'category',
  title: 'Kategori Produk',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'parentCategory',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Induk kategori untuk hierarki (kosongkan jika ini adalah kategori utama)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      parentCategory: 'parentCategory.name',
    },
    prepare({ title, media, parentCategory }) {
      const subtitle = parentCategory ? `${parentCategory} → ${title}` : title
      return { title, subtitle, media }
    },
  },
})
