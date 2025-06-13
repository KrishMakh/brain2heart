import wixData from 'wix-data';

$w.onReady(() => {
  $w("#dynamicDataset").onReady(() => {
    $w("#listRepeater").onItemReady(async ($item, itemData) => {

      // Only show published posts
      if (itemData.status !== "published") {
        $item("#postTitle").hide();
        $item("#content").hide();
        $item("#authorName").hide();
        $item("#readMoreButton").hide();
        return;
      }

      // Set post title
      $item("#postTitle").text = itemData.title;

      // Truncate and strip HTML from content
      const summary = truncateAndStripHTML(itemData.content, 300);
      $item("#content").text = summary;

      // Format and set the date
      const date = new Date(itemData._createdDate);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });
      $item("#dateCreated").text = formattedDate;

      // Get and set author's full name
      try {
        const member = await wixData.get("Members/PrivateMembersData", itemData.authorId);
        const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
        $item("#authorName").text = fullName || "Anonymous";
      } catch (err) {
        console.error("Author lookup failed:", err);
        $item("#authorName").text = "Unknown author";
      }

      // Collapse image if not available
      if (!itemData.image) {
        $item("#coverImage").collapse();
      }

      // Link to the individual post page using dynamic ID
      $item("#readMoreButton").link = `/posts/${itemData._id}`;
    });
  });
});

// Helper to strip HTML and truncate
function truncateAndStripHTML(html, maxChars = 300) {
  const text = html.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
  return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
}
