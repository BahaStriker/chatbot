import { ApiAiClient } from "api-ai-javascript";
import { applyMiddleware, createStore } from "redux";

const accessToken = "cd1162f2723a4b2b95599f254588f3fe";
const client = new ApiAiClient({ accessToken });
const ON_MESSAGE = "ON_MESSAGE";

export const sendMessage = (text, sender) => ({
  type: ON_MESSAGE,
  payload: { text, sender }
});

const messageMiddleware = () => next => action => {
  next(action);
  if (action.type === ON_MESSAGE) {
    const { text } = action.payload;
    client.textRequest(text).then(onSuccess);

    function onSuccess(response) {
      const {
        result: { fulfillment }
      } = response;
      console.log(fulfillment);
      next(sendMessage(fulfillment.speech, "bot"));
    }
  }
};

// const initState = [{ text: "Hi" }];
const messageReducer = (state = [], action) => {
  switch (action.type) {
    case ON_MESSAGE:
      return [action.payload, ...state];
    default:
      return state;
  }
};

export const store = createStore(
  messageReducer,
  applyMiddleware(messageMiddleware)
);
