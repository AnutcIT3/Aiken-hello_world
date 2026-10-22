use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

pub type Datum {
  owner: VerificationKeyHash,
}

pub type Redeemer {
  msg: ByteArray,
}

validator hello_world {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    _out_ref: OutputReference,
    self: Transaction,
  ) {
    expect Some(Datum { owner }) = datum
    let must_say_hello_world = redeemer.msg == "Hello, World!"
    let must_sign_by_owner = list.has(self.extra_signatories, owner)

    must_say_hello_world && must_sign_by_owner?
  }

  else(_) {
    fail
  }
}
