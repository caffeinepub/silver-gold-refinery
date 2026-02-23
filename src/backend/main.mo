import OutCall "http-outcalls/outcall";
import Timer "mo:core/Timer";

actor {
  let IBJA_URL = "https://ibjarates.com/";
  let PRICE_UPDATE_INTERVAL_SECONDS : Nat64 = 300;

  func updateMetalPrices() : async Text {
    await OutCall.httpGetRequest(IBJA_URL, [], transformBackend);
  };

  func startContinuousPriceUpdates<system>() {
    ignore Timer.recurringTimer<system>(
      #seconds(PRICE_UPDATE_INTERVAL_SECONDS.toNat()),
      func() : async () {
        ignore updateMetalPrices();
      },
    );
  };

  public query func transformBackend(
    input : OutCall.TransformationInput,
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func initialize<system>() : async () {
    startContinuousPriceUpdates<system>();
  };
};
