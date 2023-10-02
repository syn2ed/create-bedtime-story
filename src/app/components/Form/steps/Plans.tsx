import * as Switch from "@radix-ui/react-switch";
import { FormButtons } from "../FormButtons";
import { FormCard } from "../FormCard";
import { FormHeader } from "../FormHeader";
import { PlanCard } from "../PlanCard";
import { useFormStep } from "../../../hooks/use-form-step";
import { useLocalStorage } from "../../../hooks/use-local-storage";
import { useForm } from "../../../hooks/use-form";
import { Fragment } from "react";

const plans = [
  {
    name: 'Arcade',
    price: {
      'monthly': 9,
      'yearly': 90
    },
    icon: '/images/icons/icon-arcade.svg',
    freeTrialDescription: '2 months free',
  },
  {
    name: 'Advanced',
    price: {
      'monthly': 12,
      'yearly': 120
    },
    icon: '/images/icons/icon-advanced.svg',
    freeTrialDescription: '2 months free',
  },
  {
    name: 'Pro',
    price: {
      'monthly': 15,
      'yearly': 150
    },
    icon: '/images/icons/icon-pro.svg',
    freeTrialDescription: '2 months free',
  },
];

type TypeOfPlan = 'monthly' | 'yearly';

export type PlanWithPrices = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  }
}

export function Plans() {
  const {
    selectedPlan,
    setSelectedPlan,
    isYearly,
    setIsYearly
  } = useForm()

  const typeOfPlan: TypeOfPlan = isYearly ? 'yearly' : 'monthly';

  const { handleNextStep, handlePreviousStep } = useFormStep()

  const { saveValueToLocalStorage } = useLocalStorage()

  function handleGoForwardStep() {
    if (!selectedPlan) return;
    saveValueToLocalStorage('plan', JSON.stringify({
      name: selectedPlan,
      price: plans.find(plan => plan.name === selectedPlan.name)?.price[typeOfPlan],
      isYearly
    }))
    handleNextStep()
  }

  function handleSelectPlan(plan: PlanWithPrices) {
    setSelectedPlan({
      name: plan.name,
      price: plan.price[typeOfPlan]
    })
  }


  function handlePlanTypeChange() {
    setIsYearly(!isYearly);
  }

  return (
    <Fragment>
      <FormCard>
        <FormHeader title="Select your plan" description="You have the option of monthly or yearly billing." />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {plans.map(plan => (
            <PlanCard
              key={plan.name}
              plan={plan}
              icon={plan.icon}
              isSelected={plan.name === selectedPlan?.name}
              handleSelectPlan={handleSelectPlan}
              freeTrialDescription={plan.freeTrialDescription}
            />
          ))}
        </div>
        <div className="flex justify-center items-center gap-6 py-4 bg-very-light-grey mt-6 rounded-lg sm:mt-8">
          <span className={`text-sm font-normal ${isYearly ? 'text-grey' : 'text-denim'} duration-100`}>Monthly</span>
          <Switch.Root
            checked={isYearly}
            onCheckedChange={handlePlanTypeChange}
            className={`
              w-[40px] h-[20px] p-1 relative bg-denim rounded-full
            `}
          >
            <Switch.Thumb
              className={`
                w-[12px] h-[12px] block bg-white rounded-full
                ${isYearly ? 'translate-x-[20px]	' : 'translate-x-0'} duration-300
              `}
            />
          </Switch.Root>
          <span className={`text-sm font-normal ${isYearly ? 'text-denim' : 'text-grey'} duration-100`}>Yearly</span>
        </div>
      </FormCard>
      <FormButtons
        handleGoForwardStep={handleGoForwardStep}
        handleGoBack={handlePreviousStep}
      />
    </Fragment>
  )
}