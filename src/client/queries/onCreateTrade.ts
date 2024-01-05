export const onCreateTrade = {
    id: '6f59cca0-7704-44e1-8123-6d76096c7a68',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'OnCreateTrade',
        query: `subscription OnCreateTrade($userId: ID) {
      createTrade(userId: $userId) {
        trade {
          id
          status
          steamAppName
          cancelReason
          canJoinAfter
          markupPercent
          createdAt
          depositor {
            id
            steamId
            avatar
            displayName
            steamDisplayName
            online
          }
          depositorLastActiveAt
          expiresAt
          withdrawerSteamTradeUrl
          customValue
          withdrawer {
            id
            steamId
            avatar
            displayName
            steamDisplayName
          }
          totalValue
          updatedAt
          tradeItems {
            id
            marketName
            value
            customValue
            itemVariant {
              id
              itemId
              name
              brand
              iconUrl
              value
              displayValue
              externalId
              color
              rarity
              depositable
            }
            markupPercent
            stickers {
              value
              imageUrl
              brand
              name
              color
              wear
            }
            steamExternalAssetId
          }
          trackingType
          suspectedTraderCanJoinAfter
          joinedAt
          avgPaintWear
          hasStickers
        }
      }
    }`,
    },
};