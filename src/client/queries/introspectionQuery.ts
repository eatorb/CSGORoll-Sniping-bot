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
/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'IntrospectionQuery',
        query: `query IntrospectionQuery {
            __schema {
                queryType { name }
                mutationType { name }
                subscriptionType { name }
                types {
                    name
                    fields(includeDeprecated: true) {
                        name
                        type {
                            name
                            kind
                        }
                        args {
                            name
                            type {
                                name
                                kind
                            }
                            defaultValue
                        }
                    }
                }
                directives {
                    name
                    locations
                    args {
                        name
                        type {
                            name
                            kind
                        }
                        defaultValue
                    }
                }
            }
        }`
    },
};*/

/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'TradeTypesIntrospection',
        query: `query TradeTypesIntrospection {
            __schema {
                types {
                    name
                    fields {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                        args {
                            name
                            type {
                                name
                                kind
                                ofType {
                                    name
                                    kind
                                }
                            }
                        }
                    }
                }
            }
        }`
    },
};*/

/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'GetJoinTradesPayloadType',
        query: `query GetJoinTradesPayloadType {
            __type(name: "JoinTradesPayload") {
                name
                kind
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                    args {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        }`
    },
};*/

/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'GetAutoJoinTradePayloadType',
        query: `query GetAutoJoinTradePayloadType {
            __type(name: "AutoJoinTradePayload") {
                name
                kind
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }`
    },
};*/

/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194',
    type: 'subscribe',
    payload: {
        variables: {},
        extensions: {},
        operationName: 'GetTradeType',
        query: `query GetTradeType {
            __type(name: "Trade") {
                name
                kind
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                    args {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        }`
    },
};*/

/*export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194', // Replace with a unique ID if needed
    type: 'subscribe', // Ensure this is correct as per your GraphQL client/server requirements
    payload: {
        variables: {},
        extensions: {},
        operationName: 'IntrospectProcessTradePayload', // Changed for clarity
        query: `
            query IntrospectProcessTradePayload {
                __type(name: "ProcessTradePayload") {
                    fields {
                        name
                        type {
                            name
                            kind
                        }
                    }
                }
            }
        `
    },
};*/

export const introspectionQuery = {
    id: '5cc096b2-a6c1-4b50-87ba-18bc40a8d194', // Replace with a unique ID
    type: 'subscribe', // It's a query for introspection
    payload: {
        variables: {}, // No variables needed for this introspection query
        extensions: {}, // Extensions are usually optional
        operationName: 'GetJoinTradesInputTypeDetails', // A descriptive operation name
        query: `
                query GetJoinTradesInputTypeDetails {
                    __type(name: "JoinTradesInput") {
                        name
                        kind
                        inputFields {
                            name
                            type {
                                name
                                kind
                                ofType {
                                    name
                                    kind
                                }
                            }
                            defaultValue
                        }
                    }
                }

        `
    }
};



