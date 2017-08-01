using AutoMapper;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Helpers {
    public static class AutoMapperHelper {
        static AutoMapperHelper() {
            Mapper.Initialize(cfg => {
                cfg.CreateMap<CountdownAggregate, CountdownViewModel>()
                    .AfterMap((s, d) => d.CreatedByGravatarUrl = s.CreatedByEmail.ToGravatarUrl());
            });
        }

        public static CountdownViewModel ToCountdownViewModel(this CountdownAggregate countdownAggregate) {
            return Mapper.Map<CountdownAggregate, CountdownViewModel>(countdownAggregate);
        }
    }
}