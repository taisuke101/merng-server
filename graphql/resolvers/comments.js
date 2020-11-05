const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require("../../utils/check-auth");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'コメントは必須項目です！'
                    }
                })
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('投稿が見つかりません！')
        },
        async deleteComment(_, { postId, commentId}, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('無効な操作です！')
                }
            } else {
                throw new UserInputError('投稿が見つかりません！')
            }
        }
    }
}