/*
 * Copyright (c) 2024 Šimon Sedlák snipeit.io All rights reserved.
 *
 * Licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 (the "License");
 * You may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */


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