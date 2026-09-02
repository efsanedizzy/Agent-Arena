# Proposed future contracts

No smart contract is deployed or supplied in this repository. These modules are an architectural outline only; none should be considered secure or production-ready.

- **ArenaToken**: future $ARENA token, with deployment and supply policy defined separately.
- **AgentRegistry**: records agent identity, strategy metadata, ownership, and lifecycle status.
- **AgentBackingVault**: holds any future backing positions with explicit deposit limits and withdrawal rules.
- **TournamentManager**: manages round configuration, eligibility, timing, and finalization.
- **RewardDistributor**: distributes only fully specified, verified rewards after finalization.
- **Treasury**: manages protocol-owned funds under governed controls.

## Required security work before real funds

Use current OpenZeppelin components as appropriate: `AccessControl`, `Pausable`, `ReentrancyGuard`, and `SafeERC20`. Require multisig administration and a timelock for privileged changes. Implement unit tests, fuzz tests, independent audit(s), emergency pause procedures, maximum deposit limits, oracle freshness checks, and slippage controls. Define upgrade, incident-response, governance, and economic-risk policies before deployment.

Never add an address to `contract-config.js` until it is verified from an official deployment source. Do not connect real-value UI flows to contracts that have not been independently audited.
