import wixUsers from 'wix-users';
import wixData from 'wix-data';

$w.onReady(() => {
  $w('#submitSuccess').hide();
  $w('#submitError').hide();

  $w('#submitButton').onClick(async () => {
    $w('#submitSuccess').hide();
    $w('#submitError').hide();

    const user = wixUsers.currentUser;

    // Get input values
    const title = $w('#titleInput').value;
    const content = $w('#contentInput').value;
    const imageFiles = $w('#imageUpload').value;
    const image = imageFiles.length > 0 ? imageFiles[0] : null;

    // Basic validation
    if (!title || !content) {
      $w('#submitError').text = "Title and content are required.";
      $w('#submitError').show();
      return;
    }

    // 👤 Get member data (first name + last name)
    let memberData;
    try {
      memberData = await wixData.get("Members/PrivateMembersData", user.id);
    } catch (error) {
      console.error("Failed to get member data", error);
      $w('#submitError').text = "Could not fetch your profile info. Please try again later.";
      $w('#submitError').show();
      return;
    }

    const post = {
      title,
      content,
      authorId: user.id,
      authorFirstName: memberData.firstName,
      authorLastName: memberData.lastName,
      image,
      status: 'pending',
      dateCreated: new Date()
    };

    try {
      await wixData.insert('Posts', post);

      // Clear inputs
      $w('#titleInput').value = '';
      $w('#contentInput').value = '';

      // Reset upload button workaround
      $w("#imageUpload").hide();
      setTimeout(() => $w("#imageUpload").show(), 100);

      $w('#submitSuccess').text = "Your post has been successfully sent for approval. It will take approximately 2-3 days. If it doesn't get posted by then, feel free to email us and we will check it immediately.";
      $w('#submitSuccess').show();
    } catch (err) {
      console.error(err);
      $w('#submitError').text = "Something went wrong. Please try again. If the issue continues, please email us.";
      $w('#submitError').show();
    }
  });
});
