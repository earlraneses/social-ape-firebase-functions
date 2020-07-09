let db = {
  users: [
    {
      userId: 'fsad5324532bsdfgsdf',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2020-07-06T07:58:27.668Z',
      imageUrl: 'image/jfasdlfkjadlsa/fsadfsad',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Cebu, Philippines',
    },
  ],
  scream: [
    {
      userHandle: 'user',
      body: 'this is the scream body',
      createdAt: '2020-07-06T07:58:27.668Z',
      likeCount: 5,
      commentCount: 2,
    },
  ],
  comments: [
    {
      userHandle: 'user1',
      screamId: 'fasdfadsopoifpasd',
      body: 'nice one!',
      createdAt: '2020-07-06T07:58:27.668Z',
    },
  ],
  notifications: [
      {
          recipient: 'user1',
          sender: 'john',
          read: 'true | false',
          screamId: 'fasdfadsopoifpasd',
          type: 'like | comment',
          createdAt: '2020-07-06T07:58:27.668Z'
      }
  ]
  likes: [
    {
      userHandle: 'user1',
      screamId: 'hfsadhfskadjhfaskdlf',
    },
    {
      userHandle: 'user1',
      screamId: 'hfdfasdfasdfasdf',
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: 'HKJSDU6787998GKJHKJHKJHK',
    email: 'user1@email.com',
    handle: 'user1',
    createdAt: '2020-07-06T07:58:27.668Z',
    imageUrl: 'image/jfasdlfkjadlsa/fsadfsad',
    bio: 'Hello, my name is user1, nice to meet you',
    website: 'https://user1.com',
    location: 'Cebu, Philippines',
  }
};
