# API Routes Documentation

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [User Routes](#user-routes)
3. [Post Routes](#post-routes)
4. [Story Routes](#story-routes)
5. [Message Routes](#message-routes)
6. [Notification Routes](#notification-routes)
7. [Upload Routes](#upload-routes)
8. [Reel Routes](#reel-routes)
9. [Admin Routes](#admin-routes)

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
For protected routes, include the following header:
```
Authorization: Bearer <token>
```

## Authentication Routes
Base path: `/auth`

### Register
- **URL:** `/auth/register`
- **Method:** `POST`
- **Authentication:** No
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "token": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "name": "string",
      "avatar": "string",
      "bio": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Authentication:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "token": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "name": "string",
      "avatar": "string",
      "bio": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

### Logout
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Authentication:** Required
- **Success Response:** `204 No Content`

## User Routes
Base path: `/user`

### Get Current User
- **URL:** `/user/me`
- **Method:** `GET`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "name": "string",
      "avatar": "string",
      "bio": "string",
      "followers": ["string"],
      "following": ["string"],
      "posts": ["string"],
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

### Update User Profile
- **URL:** `/user/profile`
- **Method:** `PUT`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "name": "string",
    "bio": "string",
    "avatar": "string",
    "username": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "user": {
      "_id": "string",
      "username": "string",
      "name": "string",
      "avatar": "string",
      "bio": "string",
      "updatedAt": "date"
    }
  }
  ```

### Follow User
- **URL:** `/user/:id/follow`
- **Method:** `POST`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "message": "User followed successfully"
  }
  ```

### Unfollow User
- **URL:** `/user/:id/unfollow`
- **Method:** `POST`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "message": "User unfollowed successfully"
  }
  ```

### Get User Profile
- **URL:** `/user/:username`
- **Method:** `GET`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "user": {
      "_id": "string",
      "username": "string",
      "name": "string",
      "avatar": "string",
      "bio": "string",
      "followers": ["string"],
      "following": ["string"],
      "posts": [
        {
          "_id": "string",
          "content": "string",
          "media": {
            "url": "string",
            "type": "string"
          },
          "createdAt": "date"
        }
      ]
    }
  }
  ```

## Post Routes
Base path: `/posts`

### Create Post
- **URL:** `/posts`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "content": "string",
    "media": {
      "url": "string",
      "type": "string"
    }
  }
  ```
- **Success Response:**
  ```json
  {
    "post": {
      "_id": "string",
      "content": "string",
      "media": {
        "url": "string",
        "type": "string"
      },
      "author": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "likes": [],
      "comments": [],
      "createdAt": "date"
    }
  }
  ```

### Get Feed Posts
- **URL:** `/posts/feed`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Success Response:**
  ```json
  {
    "posts": [
      {
        "_id": "string",
        "content": "string",
        "media": {
          "url": "string",
          "type": "string"
        },
        "author": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [
          {
            "_id": "string",
            "content": "string",
            "author": {
              "_id": "string",
              "username": "string",
              "avatar": "string"
            },
            "createdAt": "date"
          }
        ],
        "createdAt": "date"
      }
    ],
    "hasMore": "boolean"
  }
  ```

### Like/Unlike Post
- **URL:** `/posts/:id/like`
- **Method:** `POST`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "message": "Post liked/unliked successfully"
  }
  ```

### Add Comment
- **URL:** `/posts/:id/comment`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "comment": {
      "_id": "string",
      "content": "string",
      "author": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "createdAt": "date"
    }
  }
  ```

## Story Routes
Base path: `/stories`

### Create Story
- **URL:** `/stories`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "media": {
      "url": "string",
      "type": "string"
    }
  }
  ```
- **Success Response:**
  ```json
  {
    "story": {
      "_id": "string",
      "media": {
        "url": "string",
        "type": "string"
      },
      "author": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "createdAt": "date",
      "expiresAt": "date"
    }
  }
  ```

### Get Stories
- **URL:** `/stories`
- **Method:** `GET`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "stories": [
      {
        "_id": "string",
        "media": {
          "url": "string",
          "type": "string"
        },
        "author": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "createdAt": "date",
        "expiresAt": "date",
        "views": ["string"]
      }
    ]
  }
  ```

### View Story
- **URL:** `/stories/:id/view`
- **Method:** `POST`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "message": "Story viewed successfully"
  }
  ```

## Message Routes
Base path: `/messages`

### Send Message
- **URL:** `/messages`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "recipient": "string",
    "content": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": {
      "_id": "string",
      "content": "string",
      "sender": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "recipient": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "createdAt": "date"
    }
  }
  ```

### Get Conversations
- **URL:** `/messages/conversations`
- **Method:** `GET`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "conversations": [
      {
        "user": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "lastMessage": {
          "_id": "string",
          "content": "string",
          "createdAt": "date"
        },
        "unreadCount": "number"
      }
    ]
  }
  ```

### Get Messages with User
- **URL:** `/messages/:userId`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
- **Success Response:**
  ```json
  {
    "messages": [
      {
        "_id": "string",
        "content": "string",
        "sender": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "recipient": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "createdAt": "date"
      }
    ],
    "hasMore": "boolean"
  }
  ```

## Notification Routes
Base path: `/notifications`

### Get Notifications
- **URL:** `/notifications`
- **Method:** `GET`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "notifications": [
      {
        "_id": "string",
        "type": "string",
        "sender": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "post": {
          "_id": "string",
          "content": "string"
        },
        "read": "boolean",
        "createdAt": "date"
      }
    ]
  }
  ```

### Mark Notification as Read
- **URL:** `/notifications/:id/read`
- **Method:** `PUT`
- **Authentication:** Required
- **Success Response:**
  ```json
  {
    "message": "Notification marked as read"
  }
  ```

## Upload Routes
Base path: `/upload`

### Upload Media
- **URL:** `/upload`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:** `multipart/form-data`
  ```
  file: File
  ```
- **Success Response:**
  ```json
  {
    "url": "string",
    "type": "string"
  }
  ```

## Reel Routes
Base path: `/reels`

### Create Reel
- **URL:** `/reels`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "caption": "string",
    "media": {
      "url": "string",
      "type": "video"
    }
  }
  ```
- **Success Response:**
  ```json
  {
    "reel": {
      "_id": "string",
      "caption": "string",
      "media": {
        "url": "string",
        "type": "video"
      },
      "author": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "likes": [],
      "comments": [],
      "views": [],
      "createdAt": "date"
    }
  }
  ```

### Get Reels Feed
- **URL:** `/reels/feed`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Success Response:**
  ```json
  {
    "reels": [
      {
        "_id": "string",
        "caption": "string",
        "media": {
          "url": "string",
          "type": "video"
        },
        "author": {
          "_id": "string",
          "username": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [
          {
            "_id": "string",
            "content": "string",
            "author": {
              "_id": "string",
              "username": "string",
              "avatar": "string"
            },
            "createdAt": "date"
          }
        ],
        "views": ["string"],
        "createdAt": "date"
      }
    ],
    "hasMore": "boolean"
  }
  ```

## Admin Routes
Base path: `/admin`

### Get Dashboard Stats
- **URL:** `/admin/stats`
- **Method:** `GET`
- **Authentication:** Required (Admin only)
- **Success Response:**
  ```json
  {
    "stats": {
      "totalUsers": "number",
      "totalPosts": "number",
      "totalStories": "number",
      "totalReels": "number",
      "activeUsers": "number"
    }
  }
  ```

### Get Reported Content
- **URL:** `/admin/reports`
- **Method:** `GET`
- **Authentication:** Required (Admin only)
- **Success Response:**
  ```json
  {
    "reports": [
      {
        "_id": "string",
        "type": "string",
        "content": {
          "_id": "string",
          "type": "string",
          "data": "object"
        },
        "reporter": {
          "_id": "string",
          "username": "string"
        },
        "reason": "string",
        "status": "string",
        "createdAt": "date"
      }
    ]
  }
  ```

### Take Action on Report
- **URL:** `/admin/reports/:id`
- **Method:** `PUT`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "action": "string",
    "reason": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "Action taken successfully"
  }
  ```

Note: All error responses follow this format:
```json
{
  "message": "Error message description"
}
```
