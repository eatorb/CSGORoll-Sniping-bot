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

export const joinTradesQuery = (uuid: string, tradeId: string) => {
    return {
        id: uuid,
        type: "subscribe",
        payload: {
            variables: {
                input: {
                    tradeIds: [tradeId],
                    recaptcha: "",
                    hasCompliedToAntiRWT: true,
                },
            },
            extensions: {},
            operationName: "JoinTrades",
            query: `
                mutation JoinTrades($input: JoinTradesInput!) {
                    joinTrades(input: $input) {
                        trades {
                            id
                        }
                    }
                }
            `,
        },
    };
};
