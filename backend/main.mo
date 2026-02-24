import OutCall "http-outcalls/outcall";
import Nat64 "mo:core/Nat64";
import Timer "mo:core/Timer";



actor {
  let IBJA_RATES_URL = "https://rates.ibja.co/";
  let PRICE_UPDATE_INTERVAL_SECONDS : Nat64 = 10;

  public query func transformBackend(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func updateMetalPrices() : async Text {
    await OutCall.httpGetRequest(IBJA_RATES_URL, [], transformBackend);
  };

  func startContinuousPriceUpdates<system>() {
    ignore Timer.recurringTimer<system>(
      #seconds(PRICE_UPDATE_INTERVAL_SECONDS.toNat()),
      func() : async () {
        ignore updateMetalPrices();
      },
    );
  };

  public func initialize<system>() : async () {
    startContinuousPriceUpdates<system>();
  };
};

