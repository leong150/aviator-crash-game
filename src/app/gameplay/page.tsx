/* eslint-disable no-mixed-operators */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCrashParams, useSubmitNetAmount } from '../../endpoints';
import NextImage from 'next/image';
import { animated, useSpring } from '@react-spring/web';
import { utils } from '@/lib';

const Component = () => {
  const isFirstTimeLoaded = useRef(true);

  const [multiplier, setMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState(1);
  const [rate, setRate] = useState(0);

  const [isOpenBetting, setIsOpenBetting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCashedOut, setIsCashedOut] = useState(false);

  const [walletBalance, setWalletBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(``);
  const [isOtherAmount, setIsOtherAmount] = useState(false);
  const [isShowValidationMessage, setIsShowValidationMessage] = useState(false);
  const [isBet, setIsBet] = useState(false);

  const countDown = useSpring({
    from: { value: 15 },
    to: { value: 0 },
    config: { duration: 15000 },
    reset: !isOpenBetting,
    pause: !isOpenBetting,
    onRest: () => {
      setIsRunning(true);
      setIsOpenBetting(false);
    },
  });

  const multiplierSpring = useSpring({
    from: { value: 1 },
    to: async (next) => {
      if (isRunning) {
        let t = 0;
        const dt = 0.05;
        // eslint-disable-next-line no-restricted-syntax
        while (true) {
          const nextValue = Math.exp(rate * t);
          if (nextValue >= crashPoint) {
            setIsRunning(false);
            setCrashPoint(nextValue);

            await submitNetAmount.request({
              amount: `-${betAmount}`,
            });

            await next({ value: crashPoint });
            break;
          }
          await next({ value: nextValue });
          t += dt;
          await new Promise((res) => {
            return setTimeout(res, dt * 1000);
          });
        }
      } else {
        await next({ value: 1 });
      }
    },
    reset: !isRunning,
    pause: !isRunning,
    config: { duration: 0 },
    delay: 1000,
  });

  const crashParams = useCrashParams({ enabled: true });

  const submitNetAmount = useSubmitNetAmount({});

  const generateCrashPoint = useCallback(() => {
    const biasProbability = Math.random();

    let crashPoint = 1;

    if (
      biasProbability <
      parseFloat(crashParams.data?.data.bias_probability || `0`)
    ) {
      crashPoint =
        Math.random() * parseFloat(crashParams.data?.data.bias_point || `0`);

      if (crashPoint < 1) {
        crashPoint = 1; // Ensure crash point is at least 1
      }

      return crashPoint;
    }

    const higherCrashPointRange =
      parseFloat(crashParams.data?.data.maximum_multiplier || `0`) -
      parseFloat(crashParams.data?.data.bias_point || `0`);

    crashPoint =
      parseFloat(crashParams.data?.data.bias_point || `0`) +
      Math.random() * higherCrashPointRange;

    if (crashPoint < 1) {
      crashPoint = 1; // Ensure crash point is at least 1
    }
    return crashPoint;
  }, [
    crashParams.data?.data.bias_point,
    crashParams.data?.data.bias_probability,
    crashParams.data?.data.maximum_multiplier,
  ]);

  const generateRate = useCallback(() => {
    return Math.random() * 0.4 + 0.1; // Random rate between 0.1 and 0.5
  }, []);

  const handleStartBet = useCallback(() => {
    setIsOpenBetting(true);
    setIsBet(false);
    setIsCashedOut(false);
    setMultiplier(1);

    setCrashPoint(generateCrashPoint());
    setRate(generateRate());
  }, [generateCrashPoint, generateRate]);

  const handleCashOut = async () => {
    if (isBet && isRunning) {
      setMultiplier(multiplierSpring.value.get());
      setIsCashedOut(true);
      setIsRunning(false);

      const cashOutAmount =
        multiplierSpring.value.get() * parseFloat(betAmount);

      const submitNetAmountResult = await submitNetAmount.request({
        amount: cashOutAmount.toFixed(2),
      });

      if (submitNetAmountResult.status === 200) {
        setWalletBalance((prev) => {
          return prev + cashOutAmount;
        });
      }
    }
  };

  let validationMessage = ``;

  if (utils.isEmpty(betAmount, true)) {
    validationMessage = `Please select an amount to bet.`;
  }
  if (parseFloat(betAmount) > walletBalance) {
    validationMessage = `Bet amount must be less than or equal to your wallet balance.`;
  }
  if (parseFloat(betAmount) < 1 || parseFloat(betAmount) > 100) {
    validationMessage = `Bet amount must be between 1 and 100.`;
  }

  useEffect(() => {
    if (crashParams.isSuccess && !isOpenBetting && !isRunning) {
      setTimeout(
        () => {
          handleStartBet();
          isFirstTimeLoaded.current = false;
        },
        isFirstTimeLoaded.current ? 0 : 5000,
      );
    }
  }, [crashParams.isSuccess, handleStartBet, isOpenBetting, isRunning]);

  return (
    <div className='flex h-screen w-screen bg-gray-900'>
      <div className='flex w-[24rem] flex-col justify-center gap-8 border-r px-10'>
        <div className='flex flex-col gap-4'>
          <span className='min-w-max text-green-400'>{`💰 Balance: $${utils.addCommasToNumber(
            walletBalance,
          )}`}</span>
        </div>
        <div className='flex flex-col gap-8'>
          {[`1`, `2`, `5`, `10`].map((amount) => {
            return (
              <button
                key={amount}
                onClick={() => {
                  setIsOtherAmount(false);
                  setBetAmount(amount);
                  setIsShowValidationMessage(false);
                }}
                className={`rounded border px-4 py-1 ${
                  betAmount === amount
                    ? `bg-blue-600 text-white`
                    : `bg-gray-700 text-gray-200 hover:bg-gray-600`
                }`}
                disabled={!isOpenBetting || isBet}
              >
                $ {utils.addCommasToNumber(amount)}
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsOtherAmount(true);
              setBetAmount(``);
            }}
            className={`rounded border px-4 py-1 ${
              isOtherAmount
                ? `bg-blue-600 text-white`
                : `bg-gray-700 text-gray-200 hover:bg-gray-600`
            }`}
            disabled={!isOpenBetting || isBet}
          >
            Other
          </button>

          <div className='flex flex-col'>
            <div className='flex items-center gap-4'>
              <span className='min-w-max text-white'>Enter amount:</span>
              <input
                type='number'
                value={isOtherAmount ? betAmount : ``}
                onChange={(e) => {
                  setIsShowValidationMessage(false);
                  setBetAmount(utils.allowNumberInputOnly(e.target.value));
                }}
                className={utils.cn(
                  `min-w-[8rem] rounded border border-gray-600 bg-gray-900 px-3 py-1 text-white focus:outline-none`,
                  !isOtherAmount && `bg-gray-300`,
                )}
                disabled={!isOtherAmount || isBet || !isOpenBetting}
              />
            </div>
            <span className='text-right text-xs text-gray-300'>{`(1 to 100 only)`}</span>
          </div>

          <button
            onClick={() => {
              if (
                utils.isEmpty(betAmount, true) ||
                parseFloat(betAmount) < 1 ||
                parseFloat(betAmount) > 100 ||
                parseFloat(betAmount) > walletBalance
              ) {
                return setIsShowValidationMessage(true);
              }

              if (
                parseFloat(betAmount) <= walletBalance &&
                parseFloat(betAmount) > 0
              ) {
                setIsBet(true);
                setWalletBalance((prev) => {
                  return prev - parseFloat(betAmount);
                });
              }
            }}
            className={utils.cn(
              `rounded bg-green-600 px-4 py-1 text-white hover:bg-green-700`,
              (!isOpenBetting || isBet) && `cursor-not-allowed opacity-50`,
            )}
            disabled={!isOpenBetting || isBet}
          >
            Place Bet
          </button>

          <span
            className={utils.cn(
              `h-[4rem] text-red-500`,
              !isShowValidationMessage && `invisible`,
            )}
          >
            {validationMessage}
          </span>
        </div>
      </div>

      <div className='flex h-full w-full flex-col items-center justify-between p-8 text-white'>
        <span className='text-4xl font-bold'>🚀 Aviator Crash Game</span>
        {isOpenBetting && (
          <animated.div
            className={`flex flex-1 flex-col items-center justify-center`}
          >
            <animated.span
              className={`-mt-12 text-[4rem] font-bold`}
              style={{
                opacity: countDown.value.to((value) => {
                  const opacityFraction = value % 1;

                  if (opacityFraction > 0.7 && value > 14) {
                    return (1 - opacityFraction) / 0.3;
                  }

                  return 1;
                }),
                transition: `opacity 0.2s`,
              }}
            >{`Game starts in`}</animated.span>
            <animated.span
              className={`h-[10rem] font-bold`}
              style={{
                fontSize: countDown.value.to((value) => {
                  const sizeFraction = value % 1;

                  if (sizeFraction > 0.8) {
                    return `${((1 - sizeFraction) / 0.2) * 2 + 4}rem`;
                  }
                  return `6rem`;
                }),
                opacity: countDown.value.to((value) => {
                  const opacityFraction = value % 1;

                  if (opacityFraction > 0.7) {
                    return (1 - opacityFraction) / 0.3;
                  }

                  if (opacityFraction < 0.4) {
                    return 0;
                  }

                  return 1;
                }),
                transition: `opacity 0.2s`,
              }}
            >
              {countDown.value.to((value) => {
                return Math.ceil(value);
              })}
            </animated.span>
          </animated.div>
        )}

        {isRunning && (
          <div className='relative flex w-full flex-1 items-center justify-center'>
            <NextImage
              src='/rocket_background.gif'
              alt='rocket_background'
              className='absolute h-full w-[60vw] object-cover p-8'
              width={0}
              height={0}
            />
            <animated.div
              style={{
                backgroundImage: `url(/rocket.png)`,
                x: multiplierSpring.value.to((value) => {
                  // horizontal shake
                  if (value > 1.5) {
                    return (Math.random() - 0.5) * 10;
                  }

                  return 0; // No shake when multiplier is low
                }),
                y: multiplierSpring.value.to((value) => {
                  // vertical shake
                  if (value > 1.5) {
                    return (Math.random() - 0.5) * 10;
                  }

                  return 0; // No shake when multiplier is low
                }),
                rotate: multiplierSpring.value.to((value) => {
                  // slight rotation
                  if (value > 1.2) {
                    return (Math.random() - 0.5) * 8 + 45;
                  }

                  return 45; // No rotation when multiplier is low
                }),
              }}
              className={`inset-0 z-10 h-[10rem] w-[10rem] bg-cover bg-center`}
            >
              <NextImage
                src='/rocket.png'
                alt='rocket'
                className='h-full w-full object-cover'
                width={300}
                height={300}
              />
            </animated.div>
          </div>
        )}

        {!isFirstTimeLoaded.current && !isRunning && !isOpenBetting && (
          <div className='flex flex-col items-center justify-center gap-4'>
            {isCashedOut ? (
              <>
                <span className='text-4xl font-bold'>{`You have won $ ${utils.addCommasToNumber(
                  multiplier * parseFloat(betAmount),
                )}`}</span>
                <NextImage
                  src='/rocket.png'
                  alt='rocket'
                  className='h-[10rem] w-[10rem] rotate-45'
                  width={300}
                  height={300}
                />
              </>
            ) : (
              <NextImage
                src='/burst.png'
                alt='burst'
                className='h-[10rem] w-[10rem]'
                width={300}
                height={300}
              />
            )}
          </div>
        )}

        <div className='flex flex-col items-center gap-4 justify-self-end'>
          {isRunning && !isCashedOut && (
            <span className={`text-4xl font-bold`}>
              <animated.span>
                {multiplierSpring.value.to((value) => {
                  return utils.addCommasToNumber(value);
                })}
              </animated.span>
              x
            </span>
          )}

          {!isFirstTimeLoaded.current &&
            !isRunning &&
            !isOpenBetting &&
            !isCashedOut && (
              <span className='text-4xl font-bold'>
                {utils.addCommasToNumber(crashPoint)}x
              </span>
            )}

          {!isRunning && !isOpenBetting && isCashedOut && (
            <span className='text-6xl font-bold'>
              {utils.addCommasToNumber(multiplier)}x
            </span>
          )}

          <button
            onClick={handleCashOut}
            className={utils.cn(
              `rounded-lg bg-yellow-500 px-6 py-2 text-5xl font-bold hover:bg-yellow-600`,
              !(isRunning && !isCashedOut) && `invisible`,
              !isBet && `cursor-not-allowed opacity-50`,
            )}
          >
            Cash Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Component;
