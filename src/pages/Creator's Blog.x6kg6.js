import { publishUserPost } from 'backend/post-approvals.jsw';
import wixData from 'wix-data';

export async function approvePost(post) {
  // 1. Publish to Blog
  const result = await publishUserPost(post);

  // 2. Update post status and add blogPostId
  await wixData.update('Posts', {
    _id: post._id,
    status: "published",
    blogPostId: result._id
  });

  return true;
}
