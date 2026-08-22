# RepairFix
Problem Statement
People often replace everyday products because they don't know where to get them repaired, how
much the repair may cost, or whether a reliable technician is available nearby. This leads to
unnecessary expenses and electronic/material waste.
Develop a simple technology solution that helps people quickly identify, report, track, and access
repair services for commonly used products and household items instead of unnecessarily
replacing them.

Focus
• Finding nearby and relevant repair services
• Reporting and tracking repair requests
• Estimating repair cost and time
• Maintaining product/service history
• Connecting users with trusted local technicians
• Promoting repair and reducing unnecessary replacement

## User workflow:
1. The user will go to the website where he will se an interface with a bunch of products listed that can be submitted for the repair, his account tab, which has the user details and the history.
2. The user either clicks on them or searches the product he wants to repair.
3. Then he sees a list of all the repairsmen available with their price range and rating.
4. The user chooses the repairmen he wants to give his product to.
5. The user gets a form which fills his - name and email and password (if no account exists, the account gets created and if it exists the user simply gets logged in), after filling, he sends the repair request.
6. After sometime the user gets a mail which contains the fixed price of the repair, date, time duration, and the date and time to collect the repaired product to go and submit the product to the repairmen.
7. on the deadline the user goes to the repairmen and collects his repaired product and gives the payment and the rating to the repairs men. 

## Repairmen workflow:
1. the repairmen has to make an account with his email, name, location and password. (no otp is sent deliberately because of time constraints)
2. on his main page he sees his listing of the products which he can repair and the requests, if no listing is there he can submit a listing with a price range. 
3. on the request page he sees the pending, in-progress and completed requests.
4. in the pending requests tab he can either accept or reject the request.
    if he rejects the request(
        a mail gets sent to the user that his request has been rejected.
    )
    if he accepts the request(
        the repairmen is provided with a form which asks him - the exact repair quote, submission date, time period, and the return date and time period. 
        after he clicks on accept, the user's interface gets updated with the conformation that the request had been accepted and it shows on the user profile a mail also gets sent to the user with all the details. 
    )
5. The repairmen works on the product after the user submits it.
6. The repairmen returns the product on the deadline and marks the request as completed after receiving the payment from the user.

## imp things that i dont want to do:
1. i dont want to be a passage way for the money transaction. 