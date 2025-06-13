import wixData from 'wix-data';

$w.onReady(async () => {
  const currentItem = $w("#dynamicDataset").getCurrentItem();

  // ✅ Check if post is published
  if (currentItem.status !== "published") {
    $w("#content").collapse(); // collapse main content container
    $w("#postTitle").text = "This post is not available.";
    return;
  }

  // ✅ Fetch author's full name from Members collection
  try {
    const member = await wixData.get("Members/PrivateMembersData", currentItem.authorId);
    const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
    $w("#authorName").text = fullName || "Anonymous";
  } catch (err) {
    console.error("Error fetching author:", err);
    $w("#authorName").text = "Unknown Author";
  }

  // ✅ Format the date nicely
  const date = new Date(currentItem._createdDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
  $w("#dateCreated").text = formattedDate;

  // ✅ Hide image if missing
  if (!currentItem.image) {
    $w("#coverImage").collapse();
  }
});
