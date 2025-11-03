import { relations } from "drizzle-orm/relations";

import { tbCheckIns,tbFinancial, tbHealthMetrics, tbPersonalData, tbUsers } from "./schema";

export const tbFinancialRelations = relations(tbFinancial, ({one}) => ({
	tbUser: one(tbUsers, {
		fields: [tbFinancial.userId],
		references: [tbUsers.id]
	}),
}));

export const tbUsersRelations = relations(tbUsers, ({many}) => ({
	tbFinancials: many(tbFinancial),
	tbHealthMetrics: many(tbHealthMetrics),
	tbPersonalData: many(tbPersonalData),
	tbCheckIns: many(tbCheckIns),
}));

export const tbHealthMetricsRelations = relations(tbHealthMetrics, ({one}) => ({
	tbUser: one(tbUsers, {
		fields: [tbHealthMetrics.userId],
		references: [tbUsers.id]
	}),
}));

export const tbPersonalDataRelations = relations(tbPersonalData, ({one}) => ({
	tbUser: one(tbUsers, {
		fields: [tbPersonalData.userId],
		references: [tbUsers.id]
	}),
}));

export const tbCheckInsRelations = relations(tbCheckIns, ({one}) => ({
	tbUser: one(tbUsers, {
		fields: [tbCheckIns.userId],
		references: [tbUsers.id]
	}),
}));