cd build

if [ -f wallets.html ]
then
  echo "Rename 'wallets.html' to 'wallets'"
  mv wallets.html wallets
fi
if [ -f withdraw_accounts.html ]
then
  echo "Rename 'withdraw_accounts.html' to 'withdraw_accounts'"
  mv withdraw_accounts.html withdraw_accounts
fi
if [ -f referral.html ]
then
  echo "Rename 'referral.html' to 'referral'"
  mv referral.html referral
fi
if [ -f security.html ]
then
  echo "Rename 'security.html' to 'security'"
  mv security.html security
fi
