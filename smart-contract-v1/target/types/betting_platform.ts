/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/betting_platform.json`.
 */
export type BettingPlatform = {
  "address": "9cYmSE5UGJ1JXkJcJvc5dKkGeHUr7PJbY1iHjjrLxfnF",
  "metadata": {
    "name": "bettingPlatform",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimPlatformFees",
      "discriminator": [
        159,
        129,
        37,
        35,
        170,
        99,
        163,
        16
      ],
      "accounts": [
        {
          "name": "bet",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "platform",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRefund",
      "discriminator": [
        15,
        16,
        30,
        161,
        255,
        228,
        97,
        60
      ],
      "accounts": [
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "userBet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              },
              {
                "kind": "account",
                "path": "bettor"
              }
            ]
          }
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimWinnings",
      "discriminator": [
        161,
        215,
        24,
        59,
        14,
        236,
        242,
        221
      ],
      "accounts": [
        {
          "name": "bet",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "userBet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              },
              {
                "kind": "account",
                "path": "bettor"
              }
            ]
          }
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createBet",
      "discriminator": [
        197,
        42,
        153,
        2,
        59,
        63,
        143,
        246
      ],
      "accounts": [
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "platform",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "resolver",
          "type": "pubkey"
        },
        {
          "name": "endTime",
          "type": "u64"
        },
        {
          "name": "bettingAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializePlatform",
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platform",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "placeBet",
      "discriminator": [
        222,
        62,
        67,
        220,
        63,
        166,
        126,
        33
      ],
      "accounts": [
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "userBet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              },
              {
                "kind": "account",
                "path": "bettor"
              }
            ]
          }
        },
        {
          "name": "platform",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": {
              "name": "betSide"
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveBet",
      "discriminator": [
        137,
        132,
        33,
        97,
        48,
        208,
        30,
        159
      ],
      "accounts": [
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "betVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "betId"
              }
            ]
          }
        },
        {
          "name": "resolver",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "betId",
          "type": "u64"
        },
        {
          "name": "winner",
          "type": {
            "defined": {
              "name": "betSide"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "discriminator": [
        147,
        23,
        35,
        59,
        15,
        75,
        155,
        32
      ]
    },
    {
      "name": "platform",
      "discriminator": [
        77,
        92,
        204,
        58,
        187,
        98,
        91,
        12
      ]
    },
    {
      "name": "userBet",
      "discriminator": [
        180,
        131,
        8,
        241,
        60,
        243,
        46,
        63
      ]
    }
  ],
  "events": [
    {
      "name": "betCreated",
      "discriminator": [
        32,
        153,
        105,
        71,
        188,
        72,
        107,
        114
      ]
    },
    {
      "name": "betPlaced",
      "discriminator": [
        88,
        88,
        145,
        226,
        126,
        206,
        32,
        0
      ]
    },
    {
      "name": "betRefunded",
      "discriminator": [
        32,
        234,
        173,
        102,
        106,
        4,
        2,
        203
      ]
    },
    {
      "name": "betResolved",
      "discriminator": [
        133,
        89,
        89,
        125,
        4,
        219,
        82,
        137
      ]
    },
    {
      "name": "winningsClaimed",
      "discriminator": [
        187,
        184,
        29,
        196,
        54,
        117,
        70,
        150
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "titleTooLong",
      "msg": "Title too long"
    },
    {
      "code": 6001,
      "name": "descriptionTooLong",
      "msg": "Description too long"
    },
    {
      "code": 6002,
      "name": "resolverCannotBeCreator",
      "msg": "Resolver cannot be the creator"
    },
    {
      "code": 6003,
      "name": "betNotActive",
      "msg": "Bet is not active"
    },
    {
      "code": 6004,
      "name": "betEnded",
      "msg": "Bet has Expired"
    },
    {
      "code": 6005,
      "name": "betNotEnded",
      "msg": "Bet is yet to end"
    },
    {
      "code": 6006,
      "name": "resolutionDeadlineExpired",
      "msg": "Resolution deadline has expired, Bet amounts to be refunded soon"
    },
    {
      "code": 6007,
      "name": "invalidAmount",
      "msg": "Invalid Amount"
    },
    {
      "code": 6008,
      "name": "resolverCannotPlaceBet",
      "msg": "Resolver cannot place bets "
    },
    {
      "code": 6009,
      "name": "cannotChangeSide",
      "msg": "One account can bet only one side"
    },
    {
      "code": 6010,
      "name": "unauthorizedResolver",
      "msg": "Unauthorized Resolver"
    },
    {
      "code": 6011,
      "name": "unresolvedBet",
      "msg": "Bet not Resolved"
    },
    {
      "code": 6012,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6013,
      "name": "notWinner",
      "msg": "Not a winner"
    },
    {
      "code": 6014,
      "name": "alreadyClaimed",
      "msg": "Winnings already claimed"
    },
    {
      "code": 6015,
      "name": "resolutionDeadlineNotPassed",
      "msg": "Resolution deadline has not passed"
    },
    {
      "code": 6016,
      "name": "betCanOnlyBePlacedOnce",
      "msg": "A bet can only be placed once"
    }
  ],
  "types": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "bettingAmount",
            "type": "u64"
          },
          {
            "name": "resolver",
            "type": "pubkey"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "resolutionDeadline",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "betStatus"
              }
            }
          },
          {
            "name": "participants",
            "type": "u64"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "sideAAmount",
            "type": "u64"
          },
          {
            "name": "sideBAmount",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": {
              "option": {
                "defined": {
                  "name": "betSide"
                }
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "betCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "resolver",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "endTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "betPlaced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "betSide"
              }
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "betRefunded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "betResolved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": {
              "defined": {
                "name": "betSide"
              }
            }
          },
          {
            "name": "resolver",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "betSide",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "a"
          },
          {
            "name": "b"
          }
        ]
      }
    },
    {
      "name": "betStatus",
      "docs": [
        "Enum"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "resolved"
          },
          {
            "name": "refunded"
          }
        ]
      }
    },
    {
      "name": "platform",
      "docs": [
        "Data Structures"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "totalBets",
            "type": "u64"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userBet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "betSide"
              }
            }
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "winningsClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "bettor",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
