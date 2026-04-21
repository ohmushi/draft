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
    output: 'export',
    pageExtensions: ['ts', 'tsx', 'mdx'],
})