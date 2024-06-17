export const autoJoinTradeQuery = (uuid: string, tradeId: string) => {
    return {
        id: uuid,
        type: "subscribe",
        payload: {
            variables: {
                input: {
                    tradeId: tradeId,
                    secret: 'secret'
                }
            },
            extensions: {},
            operationName: "AutoJoinTrade",
            query: `
                mutation AutoJoinTrade($input: AutoJoinTradeInput!) {
                    autoJoinTrade(input: $input) {
                        trade {
                            id
                            status
                        }
                    }
                }
            `
        }
    };
};
