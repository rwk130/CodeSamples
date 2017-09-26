using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CashRegister : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        double gChange; //Change global variable

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        private void MakeRandomChange(double mTotal, double mPaid)
        {
            int mDollars = 0;
            int mQuarters = 0;
            int mDimes = 0;
            int mNickels = 0;
            int mPennies = 0;

            Random mRand = new Random();
            int mMax = 5;
            while (gChange > 0)
            {
                /* First determine what types of change are elligible
                 * Type 5 is dollars, 4 is quarters, 3 is dimes, 2 is nickels, and 1 is pennies
                 */
                if (gChange > 1)
                {
                    mMax = 5;
                }
                else if (gChange > .25)
                {
                    mMax = 4;
                }
                else if (gChange > .10)
                {
                    mMax = 3;
                }
                else if (gChange > .05)
                {
                    mMax = 2;
                }
                else
                {
                    mMax = 1;
                }

                //Choose a change type at random
                int mType = mRand.Next(0, mMax) + 1;
                double mTemp = gChange;
                //Add count of change type and adjust change amount
                switch (mType)
                {
                    case 2:
                        mNickels++;
                        gChange -= .05;
                        break;
                    case 3:
                        mDimes++;
                        gChange -= .10;
                        break;
                    case 4:
                        mQuarters++;
                        gChange -= .25;
                        break;
                    case 5:
                        mDollars++;
                        gChange--;
                        break;
                    default:
                        mPennies++;
                        gChange -= .01;
                        break;
                }
                gChange = Math.Round(gChange, 2, MidpointRounding.AwayFromZero);
            }

            //add new result to screen
            FillLabel(mDollars, mQuarters, mDimes, mNickels, mPennies);
        }

        private void MakeChange(double aTotal, double aPaid)
        {
            int mDollars = GetChangeCount(1.0); //Get dollars for change
            int mQuarters = GetChangeCount(.25); //Get quarters for change
            int mDimes = GetChangeCount(.10);
            int mNickels = GetChangeCount(.05);
            int mPennies = GetChangeCount(.01);

            FillLabel(mDollars, mQuarters, mDimes, mNickels, mPennies);
        }

        //Generate string to return to screen
        private void FillLabel(int aDollars, int aQuarters, int aDimes, int aNickels, int aPennies)
        {
            string mResult = ListChange(aDollars, "dollar");
            mResult += ", " + ListChange(aQuarters, "quarter");
            mResult += ", " + ListChange(aDimes, "dime");
            mResult += ", " + ListChange(aNickels, "nickel");
            mResult += ", " + ListChange(aPennies, "penny");

            while (mResult.Contains(", ,"))
            {
                mResult = mResult.Replace(", ,", ",");
            }

            while (mResult.StartsWith(", "))
            {
                mResult = mResult.Substring(2);
            }

            lblChange.Text += mResult + "<br /><br />";
        }

        //Generate part of return string specific to current amount (dollar, quarter, dime, etc.)
        private string ListChange(int aCount, string aName)
        {
            string mList = String.Empty;
            if (aCount > 0)
            {
                mList = aCount.ToString() + " " + aName;
            }
            if (aCount > 1)
            {
                mList += "s";
                mList = mList.Replace("y", "ie");
            }
            return mList;
        }

        //Get count of change type based on worth (dollar = 1, quarter = .25, etc.)
        private int GetChangeCount(double aAmount)
        {
            int mCount = 0;
            while (gChange >= aAmount)
            {
                mCount++;
                gChange -= aAmount;
                gChange = Math.Round(gChange, 2, MidpointRounding.AwayFromZero);
            }
            return mCount;
        }

        protected void btnGetChange_Click(object sender, EventArgs e)
        {
            try
            {
                lblChange.Text = String.Empty;
                double mTotal = 0;
                double mPaid = 0;
                //parse string into doubles. If they error, set amount as -1
                if (!double.TryParse(txtTotal.Text.Replace("$", ""), out mTotal))
                {
                    mTotal = -1;
                }
                try
                {
                    if (!double.TryParse(txtPaid.Text.Replace("$", ""), out mPaid))
                    {
                        mPaid = -1;
                    }
                }
                catch
                {
                    mPaid = -1;
                }
                gChange = Math.Round(mPaid - mTotal, 2, MidpointRounding.AwayFromZero);
                if (mTotal < 0) //Total not parsed to double
                {
                    lblChange.Text += "Error parsing total owed (" + txtTotal.Text + ") to dollar amount<br /><br />";
                }
                else if (mPaid < 0)//amount paid not parsed to double
                {
                    lblChange.Text += "Error parsing amount paid (" + txtPaid.Text + ") to dollar amount<br /><br />";
                }
                else if (gChange < 0) //amount paid is less than amount owed
                {
                    lblChange.Text += String.Format("{0:C}", gChange * -1) + " is still owed<br /><br />";
                }
                else if (gChange == 0) //paid exact amount owed
                {
                    lblChange.Text += "No change<br /><br />";
                }
                else if ((mTotal * 100) % 3 == 0) //if total is divisible by 3, give random change
                {
                    lblChange.Text += String.Format("{0:C}", gChange) + " is to be paid back in:<br />";
                    MakeRandomChange(mTotal, mPaid);
                }
                else
                {
                    lblChange.Text += String.Format("{0:C}", gChange) + " is to be paid back in:<br />";
                    MakeChange(mTotal, mPaid);
                }
            }
            catch
            {

            }
        }
    }
}