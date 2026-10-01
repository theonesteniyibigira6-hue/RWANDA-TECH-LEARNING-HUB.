rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    function isUnderSizeMB(sizeMB) {
      return request.resource.size <= sizeMB * 1024 * 1024;
    }

    // Public educational resources (Course materials, book PDFs)
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Uploads allowed only via Firebase Admin SDK
    }

    // Profile photos directory
    match /users/{userId}/avatars/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) 
                   && isImage() 
                   && isUnderSizeMB(5); // Limit avatar images to 5MB
    }

    // User assignment submissions and generated certificates
    match /users/{userId}/documents/{fileName} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId) && isUnderSizeMB(10); // Limit files to 10MB
    }
  }
}