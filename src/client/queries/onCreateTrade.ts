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

import {v4 as uuidv4} from "uuid";


export const onCreateTrade = {
    id: '3566f08a-de46-49f1-a93a-7c767a86dc7f',
    type: "subscribe",
    payload: {
        query: `
      subscription OnCreateTrade($userId: ID) {
        createTrade(userId: $userId) {
          trade {
            id
            markupPercent
            totalValue
          }
        }
      }
    `
    }
};