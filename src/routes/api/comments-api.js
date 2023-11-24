const express = require('express');
const router = express.Router();

const commentDao = require('../../models/comments-dao.js');
const articlesDao = require('../../models/articles-dao.js');
const notifyDao = require('../../models/notify-dao.js');
const gDao = require('../../models/generic-dao.js');

router.post('/api/addComment', async function (req, res) {
    try {
        const user_id = res.locals.user.id;
        const comment = req.body;
        const content = comment.contentKey;
        const comment_id = comment.comment_idKey;
        const article_id = comment.article_idKey;

        let done = undefined;

        if (!comment_id) {
            done = await commentDao.insertNewCommentOnArticle(
                user_id,
                article_id,
                content
            );
            if (!done) {
                throw new Error('Comment submitting failed, please try again.');
            }
            const comment_id = done.lastID;

            const newComment = await commentDao.getCommentById(comment_id);

            res.status(200).json(newComment);
        } else {
            done = await commentDao.insertNewCommentOnComment(
                user_id,
                article_id,
                content,
                comment_id
            );

            if (!done) {
                throw new Error('Comment submitting failed, please try again.');
            }

            const new_comment_id = done.lastID;
            const newComment = await commentDao.getCommentById(new_comment_id);

            res.status(200).json(newComment);
        }
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/api/deleteComment', async function (req, res) {
    const comment = req.body;
    const comment_id = comment.comment_idKey;
    const article_id = comment.article_idKey;
    try {
        let done = undefined;

        done = await commentDao.deleteThisComment(comment_id, article_id);

        if (!done) {
            throw new Error('Comment deleting failed, please try again');
        }

        res.status(200).send('Comment deleted');
    } catch (e) {
        res.status(404).send(
            e + 'what the fuck is going on; haha damn bro its ok'
        );
    }
});

router.post('/api/create-new-comment-notification', async function (req, res) {
    const userId = res.locals.user.id;
    let receiverId;
    const articleId = parseInt(req.body.articleId);
    const parentId = req.body.parentId;
    let type;
    try {
        if (!parentId) {
            type = 'comment';
            const res = gDao.makeArray(await articlesDao.getAuthorIdByArticleId(articleId));
            receiverId = res[0].author_id;
        } else {
            type = 'reply';
            const res = gDao.makeArray(await commentDao.getAuthorIdByCommentId(parentId));
            receiverId = res[0].user_id;
        }

        const n = await notifyDao.createNotification(
            receiverId,
            userId,
            articleId,
            type
        );

        await notifyDao.storeNotificationToUser(
            n.senderId,
            n.receiverId,
            n.timestamp,
            n.content,
            n.articleId,
            n.type,
            n.isRead,
            n.isViewed,
        );

        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
