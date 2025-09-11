import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { InsurersModule } from "./insurers/insurers.module";
import { QuotesModule } from "./quotes/quotes.module";
import { PlansModule } from "./plans/plans.module";
import { CouponsModule } from "./coupons/coupons.module";
import { PricingModule } from "./pricing/pricing.module";
import { CheckoutModule } from "./checkout/checkout.module";
import { OrdersModule } from "./orders/orders.module";
import { VouchersModule } from "./vouchers/vouchers.module";
import { CmdModule } from "./cmd/cmd.module";
import { N8nModule } from "./n8n/n8n.module";
import { AdminModule } from "./admin/admin.module";

@Module({
	imports: [
		UsersModule,
		InsurersModule,
		QuotesModule,
		PlansModule,
		CouponsModule,
		PricingModule,
		CheckoutModule,
		OrdersModule,
		VouchersModule,
		CmdModule,
		N8nModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
