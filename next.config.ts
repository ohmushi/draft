import createMDX from '@next/mdx'

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            'remark-frontmatter',
            'remark-mdx-frontmatter',
        ],
        rehypePlugins: [],
    },
})

export default withMDX({
    output: 'standalone',
    pageExtensions: ['ts', 'tsx', 'mdx'],
    outputFileTracingIncludes: {
        '/': ['./content/entries/**/*'],
        '/entry/[slug]': ['./content/entries/**/*'],
    },
})